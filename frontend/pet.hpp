#include <iostream>
#include <string.h>

class Pet
{
    public:

    //Pet();

    Pet(std::string name = "", int star_unlock = 0);

    std::string getName();

    void setName(std::string name);

    int getStarUnlock();

    void setStarUnlock(int star_unlock);

    bool enoughStars(int star_count);

    private:
    std::string name_;
    int star_unlock_;
};